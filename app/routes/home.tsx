import type { Route } from "./+types/home";
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import { MdCalendarMonth, MdOutlineArticle, MdOutlineLocationOn, MdOutlinePersonOutline } from "react-icons/md";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '../styles/phone-input.css';
import { useLoadingStore } from "~/utilities/useStore";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Event Registration" },
    { name: "description", content: "Register for the event" },
  ];
}

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  mobile: string;
}

function Logo() {
  return (
    <img
      src="/logo.png"
      alt="sifely logo"
      className="h-8 mx-auto mb-6"
    />
  )
}

function Sad() {
  return (
    <img
      src="/sad.png"
      alt="sifely logo"
      className="h-8 mx-auto my-18"
    />
  )
}

export default function Home() {
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    mobile: '',
  });

  const navigate = useNavigate();
  const { eventId } = useParams();

  const { fetchActivityInfo, data, handleSubmit } = useLoadingStore()

  useEffect(() => {
    const memberId = localStorage.getItem(eventId!)
    if (memberId) {
      navigate(`/submitted?memberId=${memberId}`)
    } else {
      fetchActivityInfo(eventId!)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryCodeChange = (value: string | undefined) => {
    if (!value) {
      setUserData(prev => ({ ...prev, countryCode: '+1', mobile: '' }));
      return;
    }
    const arr = ref.current.value.split(" ")
    setUserData(prev => ({
      ...prev,
      countryCode: arr[0],
      mobile: value.split(arr[0])[1],
    }));
  };
  const ref = useRef<any>(null)

  const { startTime, endTime, limits, memberCount } = useMemo(() => {
    if (!data) return { startTime: dayjs(), endTime: dayjs(), limits: 1, memberCount: 0 };

    const timezone = dayjs.tz.guess()

    const startTime = dayjs(data.startTime).tz(data.timezoneInfo || timezone)
    const endTime = dayjs(data.endTime).tz(data.timezoneInfo || timezone)
    return { startTime, endTime, limits: data.limits || 1, memberCount: data.memberCount || 0 };
  }, [data])

  const btnDisabled = useMemo(() => {
    if (!userData.firstName || !userData.lastName || !userData.countryCode || !userData.email || !userData.mobile) {
      return true
    }
    return false
  }, [userData])

  if (memberCount >= limits) {
  // if (true) {
    return (
      <div className="min-h-screen bg-base-100 p-6">
        <Logo />
        <Sad />
        <p className="text-center">Oops…Looks like this event is full. Better luck next time!</p>
      </div>
    )
  }

  if (data?.isDelete === 1) {
    return (
      <div className="min-h-screen bg-base-100 p-4">
        <Logo />
        <Sad />
        <p className="text-center">Oops…Looks like this event had been deleted. Better luck next time!</p>
      </div>
    )
  }

  if (Date.now() >= data?.endTime!) {
    return (
      <div className="min-h-screen bg-base-100 p-4">
        <Logo />
        <Sad />
        <p className="text-center">Oops…Looks like this event has expired. Better luck next time!</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <Logo />

      {data && (
        <div className="space-y-2 mb-4">
          {/* Event Title */}
          <p>
            You're invited to join <span className="font-bold">{data.name}</span>!
          </p>

          {/* Event Details */}
          <div className="space-y-2">
            <div className="flex items-start gap-3 mt-2">
              <MdCalendarMonth className="text-xl mt-0.5" />
              <p className="w-7/8">
                {startTime.format("MMM D, YYYY h:mm A")} - {endTime.format("MMM D, YYYY h:mm A")}<br/>({data.timezoneInfo})
              </p>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <MdOutlinePersonOutline className="text-xl mt-0.5" />
              <p>Hosted by {data.nickName} ({data.contactInfo})</p>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <MdOutlineLocationOn className="text-xl mt-0.5" />
              <span className="whitespace-pre-line">{data.location || "Not Set"}</span>
            </div>

            <div className="flex items-start gap-3 mt-2">
              <MdOutlineArticle className="text-xl mt-0.5" />
              <span className="whitespace-pre-line">{data.descriptions || "Not Set"}</span>
            </div>
          </div>
        </div>
      )}

      <p className="text-md mb-3">
        Please fill out the following form to confirm and get your unique entry code.
      </p>

      {/* Registration Form */}
      <form className="space-y-3">
        <div className="form-control w-full mt-3">
          <label>
            <span>*First Name</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
            required
            className="input h-10 pl-3 input-bordered border-[#000] border-1 w-full rounded-lg"
          />
        </div>

        <div className="form-control w-full mt-3">
          <label>
            <span>*Last Name</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
            required
            className="input h-10 pl-3 input-bordered border-[#000] border-1 w-full rounded-lg"
          />
        </div>

        <div className="form-control w-full mt-3">
          <label>
            <span>*Email</span>
          </label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            required
            className="input h-10 pl-3 input-bordered border-[#000] border-1 w-full rounded-lg"
          />
        </div>

        <div className="form-control w-full mt-3">
          <label>
            <span>*Phone Number</span>
          </label>
          <PhoneInput
            ref={ref}
            international
            countryCallingCodeEditable={false}
            defaultCountry="US"
            value={userData.countryCode}
            onChange={handleCountryCodeChange}
            className="input h-10 border-[#000] w-full border-1 rounded-lg border-r-0"
          />
        </div>

        <button
          type="submit"
          className="btn h-14 bg-[#2E8B57] btn-block rounded-4xl text-white mt-4"
          // onClick={handleSubmit}
          onClick={async (e: React.FormEvent) => {
            e.preventDefault();
            const res = await handleSubmit({ ...userData, activityId: eventId! })
            if (res) navigate(`/submitted?memberId=${res}`);
          }}
          disabled={btnDisabled}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
