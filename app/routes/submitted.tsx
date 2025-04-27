import { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { MdCalendarMonth, MdOutlineArticle, MdOutlineLocationOn, MdOutlinePersonOutline } from "react-icons/md";
import dayjs from "dayjs";
import { useLoadingStore } from "~/utilities/useStore";

export function meta() {
    return [
      { title: "Event Details" },
      { name: "description", content: "Your event entry code and details" },
    ];
  }

export default function Submitted() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { fetchMemberInfo, memberInfo } = useLoadingStore()

  useEffect(() => {
    const memberId = searchParams.get('memberId');
    if (!memberId) {
      navigate('/error/404');
      return;
    }
    ;(async function() {
      const res = await fetchMemberInfo(memberId);
      // if (res === false) {
      //   localStorage.removeItem("memberId");
      // }
    })()
  }, []);

  const Submitted = useCallback(() => {
    return (
      <div className="min-h-screen bg-base-100 p-4">
        <img
          src="/logo.png"
          alt="sifely logo"
          className="h-8 mx-auto mb-6"
        />
        <h1 className="text-center font-semibold text-2xl">Submitted!</h1>
        <img
          src="/success.png"
          alt="success"
          className="h-15 mx-auto m-6"
        />
        <p>You'll receive the entry code via SMS and email within <span className="font-semibold">1 hour</span>.</p>
        <br/>
        <p>Please keep an eye out, and feel free to contact our support team if you need help.</p>
      </div>
    )
  }, [])

  if (memberInfo) {
    if (memberInfo.status === "pending" || !memberInfo.passcode) {
    // if (true) {
      return <Submitted />
    }
    if (memberInfo.endTime < Date.now()) {
    // if (true) {
      return (
        <div className="min-h-screen bg-base-100 p-4">
          <img
            src="/logo.png"
            alt="sifely logo"
            className="h-8 mx-auto mb-6"
          />
          <div className="relative card bg-base-200 shadow-xl mb-6 p-6 text-center">
            <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-tr-lg rounded-bl-lg">
              Expired
            </div>
            <h2 className="text-gray-500 text-xl font-semibold mb-4">{memberInfo.name}</h2>
            <div className="text-gray-400 text-4xl font-bold tracking-wider">
              #{memberInfo.passcode}#
            </div>
          </div>
        </div>
      )
    }
    if (memberInfo.isDelete !== 0) {
    // if (true) {
      return (
        <div className="min-h-screen bg-base-100 p-4">
          <img
            src="/logo.png"
            alt="sifely logo"
            className="h-8 mx-auto mb-6"
          />
          <div className="relative card bg-base-200 shadow-xl mb-6 p-6 text-center">
            <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-tr-lg rounded-bl-lg">
              Deleted
            </div>
            <h2 className="text-gray-500 text-xl font-semibold mb-4">{memberInfo.name}</h2>
            <div className="text-gray-400 text-4xl font-bold tracking-wider">
              #{memberInfo.passcode}#
            </div>
          </div>
        </div>
      )
    }
    const timezone = dayjs.tz.guess();
    const startTime = dayjs(memberInfo.startTime).tz(memberInfo.timezoneInfo || timezone);
    const endTime = dayjs(memberInfo.endTime).tz(memberInfo.timezoneInfo || timezone);

    return (
      <div className="min-h-screen bg-base-100 p-4">
        <img
          src="/logo.png"
          alt="sifely logo"
          className="h-8 mx-auto mb-6"
        />

        {/* Event name and passcode */}
        <div className="card bg-base-200 shadow-xl mb-6 p-6 text-center mx-6">
          <h2 className="text-xl font-semibold mb-4">{memberInfo.name}</h2>
          <div className="text-4xl font-bold tracking-wider">
            #{memberInfo.passcode}#
          </div>
        </div>

        {/* Welcome info */}
        <div className="card bg-base-100 mb-6">
          <div className="card-body text-lg">
            <h3>Hi <span className="font-semibold">{memberInfo.firstName}</span>,</h3>
            <p className="text-base-content">
              Now you can use the entry code above to join <span className="font-semibold">{memberInfo.name}</span>.
            </p>
            <p className="text-base-content">
              Hope you have a great time !
            </p>
          </div>
        </div>

        {/* Event details */}
        <div className="space-y-2 m-6">
          <div className="flex items-start gap-3 mt-2">
            <MdCalendarMonth className="text-xl mt-0.5" />
            <p className="w-7/8">
              {startTime.format("MMM D, YYYY h:mm A")} - {endTime.format("MMM D, YYYY h:mm A")}<br/>({memberInfo.timezoneInfo})
            </p>
          </div>

          <div className="flex items-start gap-3 mt-2">
            <MdOutlinePersonOutline className="text-xl mt-0.5" />
            <p>Hosted by {memberInfo.nickName} ({memberInfo.contactInfo})</p>
          </div>

          <div className="flex items-start gap-3 mt-2">
            <MdOutlineLocationOn className="text-xl mt-0.5" />
            <span className="whitespace-pre-line">{memberInfo.location || "Not Set"}</span>
          </div>

          <div className="flex items-start gap-3 mt-2">
            <MdOutlineArticle className="text-xl mt-0.5" />
            <span className="whitespace-pre-line">{memberInfo.descriptions || "Not Set"}</span>
          </div>
        </div>
      </div>
    );
  } else if (memberInfo === null) {
    return <Submitted />
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
}
